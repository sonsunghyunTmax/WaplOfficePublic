/* eslint-disable @typescript-eslint/no-explicit-any */

export enum IndexedDBType {
  OFFICE = 'office',
}

/**
 * DB명_Store명
 */
export enum IndexedDBStoreType {
  OFFICE_RESOURCE = 'resource',
  OFFICE_THEME = 'theme',
}

type IndexedDBInfoMapType = {
  [key in IndexedDBType]: {
    databaseName: string;
    databaseVersion: number;
    storeTypes: IndexedDBStoreType[];
  };
};

type IndexedDBStoreInfoMapType = {
  [key in IndexedDBStoreType]: {
    databaseType: IndexedDBType;
    storeName: string;
    needStoreClear: boolean; // indexedDB 버전이 올라갈 경우 store를 clear해야 하는지 여부
  };
};

/**
 * IndexedDB 정보
 */
const indexedDBInfoMap: IndexedDBInfoMapType = {
  [IndexedDBType.OFFICE]: {
    databaseName: 'office',
    databaseVersion: Number(process.env.RESOURCE_VERSION),
    storeTypes: [IndexedDBStoreType.OFFICE_RESOURCE, IndexedDBStoreType.OFFICE_THEME],
  },
};

/**
 * IndexedDB Store 정보
 */
const indexedDBStoreInfoMap: IndexedDBStoreInfoMapType = {
  [IndexedDBStoreType.OFFICE_RESOURCE]: {
    databaseType: IndexedDBType.OFFICE,
    storeName: 'resource',
    needStoreClear: true,
  },
  [IndexedDBStoreType.OFFICE_THEME]: {
    databaseType: IndexedDBType.OFFICE,
    storeName: 'theme',
    needStoreClear: false,
  },
};

async function openDatebase(indexedDBType: IndexedDBType): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('indexedDB is not supported'));
    }
    let db: IDBDatabase;
    const { databaseName, databaseVersion, storeTypes } = indexedDBInfoMap[indexedDBType];
    const openRequest = indexedDB.open(databaseName, databaseVersion);

    openRequest.onerror = () => {
      reject(openRequest.error);
    };

    openRequest.onsuccess = () => {
      db = openRequest.result;

      db.onversionchange = function () {
        // 연결되어 있는 동안 버전이 올라간 경우 db연결 해제
        db.close();
      };

      resolve(db);
    };

    openRequest.onblocked = () => {
      reject(new Error('indexedDB is blocked'));
    };

    openRequest.onupgradeneeded = () => {
      db = openRequest.result;
      storeTypes.forEach(storeType => {
        const storeInfo = indexedDBStoreInfoMap[storeType];
        if (!db.objectStoreNames.contains(storeInfo.storeName)) {
          db.createObjectStore(storeInfo.storeName, { keyPath: 'id' });
          resolve(db);
        } else if (storeInfo.needStoreClear) {
          // 버전이 변경되면 store의 데이터 초기화
          const { transaction } = openRequest;

          if (transaction) {
            const store = transaction.objectStore(storeInfo.storeName);

            // 객체 저장소의 모든 데이터 삭제
            const clearRequest = store.clear();
            clearRequest.onsuccess = () => {
              resolve(db);
            };
            clearRequest.onerror = () => {
              reject(clearRequest.error);
            };
          }
        }
      });
    };
  });
}

const IndexedDBUtil = {
  /**
   * IndexedDB를 open하고 종료하는 template
   * action을 통해 open한 db에 대한 연산을 수행
   */
  async transactionTemplate(
    indexedDBType: IndexedDBType,
    action: (db: IDBDatabase) => Promise<any>
  ): Promise<any> {
    let indexedDB = null;
    try {
      indexedDB = await openDatebase(indexedDBType);
      return await action(indexedDB);
    } finally {
      if (indexedDB) indexedDB.close();
    }
  },

  /**
   * key가 이미 존재하면 fail, 존재하지 않으면 insert
   */
  async addData(db: IDBDatabase, storeName: string, data: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      transaction.oncomplete = () => {
        resolve(true);
      };

      transaction.onerror = () => {
        reject(request.error);
      };
    });
  },

  /**
   * key가 이미 존재하면 update, 존재하지 않으면 insert
   */
  async putData(db: IDBDatabase, storeName: string, data: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      transaction.oncomplete = () => {
        resolve(true);
      };

      transaction.onerror = () => {
        reject(request.error);
      };
    });
  },

  async getData(db: IDBDatabase, storeName: string, key: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      const request = store.get(key);

      transaction.oncomplete = () => {
        if (request.result) {
          resolve(request.result);
        } else {
          resolve(null);
        }
      };

      transaction.onerror = () => {
        resolve(null);
      };
    });
  },

  async deleteData(db: IDBDatabase, storeName: string, key: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      const request = store.delete(key);

      transaction.oncomplete = () => {
        resolve(true);
      };

      transaction.onerror = () => {
        reject(request.error);
      };
    });
  },

  /**
   * indexedDB에서 json 형태의 데이터를 조회하는 api
   * - indexedDB에 key에 대응하는 데이터가 존재할 경우 반환
   * - indexedDB에 key에 대응하는 가 없으면 fetchUrl 주소로 데이터를 요청 후 db insert 및 반환
   */
  async getJSONDataWithFallback(
    db: IDBDatabase,
    storeName: string,
    key: string,
    fallback?: () => any
  ): Promise<any> {
    try {
      const cached = await this.getData(db, storeName, key);
      if (cached) {
        let storedData = null;
        try {
          storedData = JSON.parse(cached.value);
        } catch (err) {
          // data 파싱 에러가 나면 무시
          console.error(`IndexedDB resource parsing error: ${err}`);
        }

        if (!storedData) {
          await this.deleteData(db, storeName, key);
          throw new Error(`IndexedDB resource is null `);
        }

        return storedData;
      }

      if (!fallback) return null;

      try {
        const data = await fallback();
        if (!data) return null;

        try {
          const newData = {
            id: key,
            value: JSON.stringify(data),
          };
          // 요청으로 받은 데이터를 로컬 스토리지에 저장합니다.
          await this.putData(db, storeName, newData);
        } catch (err) {
          // data 파싱 에러가 나면 무시
          console.error(`Fetched resource parsing error: ${err}`);
        }

        return data;
      } catch (err) {
        console.error(`Resource request failed: ${err}`);
        return null;
      }
    } catch (err) {
      // 인덱스 db 없이 실행
      if (fallback) {
        const data = await fallback();
        return data;
      }
      return null;
    }
  },
};

export default IndexedDBUtil;
