import { spy } from 'mobx';
import { boundMethod } from 'autobind-decorator';

const actionStyle = {
  prefix: 'color: green;',
  actor: '',
  actorId: 'color: purple; font-style: italic;',
  actionName: 'font-weight: bold;',
  eventArguments: 'color: orangered;',
};

const reactionStyle = {
  prefix: 'color: blue;',
  reactor: 'font-weight: bold;',
};

const errorStyle = {
  prefix: 'color: red;',
  name: '',
  message: 'font-weight: bold;',
  error: '',
};

interface ParsedAction {
  actor: string;
  actorID: string;
  actionName: string;
  eventArguments: string;
}

/**
 * Mobx 의 변화를 hooking 을 통해 로그를 보여주는 class 입니다.
 * Singleton 으로 제공됩니다.
 */
class MobxLogger {
  private stopFn?: () => void;

  public constructor() {
    this.stopFn = undefined;
  }

  /**
   * Logging 을 시작하는 함수입니다.
   */
  @boundMethod
  public start(): void {
    // 이미 동작하고 있는 경우 중복해서 로깅을 할 필요가 없음
    if (this.stopFn !== undefined) {
      return;
    }
    this.stopFn = spy(event => {
      if (event.type === 'action') {
        const parsed = this.parseActionEvent(event);
        this.logActionEvent(parsed);
      } else if (event.type === 'reaction' || event.type === 'scheduled-reaction') {
        const scheduled = event.type === 'scheduled-reaction';
        console.log(
          `[${this.currentTime()}]%c[R]${scheduled ? '[Scheduled]' : ''} %c${event.name}`,
          reactionStyle.prefix,
          reactionStyle.reactor
        );
      } else if (event.type === 'error') {
        console.log(
          `[${this.currentTime()}]%c[E] %c${event.name} %c${event.message} %c${event.error}`,
          errorStyle.prefix,
          errorStyle.name,
          errorStyle.message,
          errorStyle.error
        );
      }
    });
  }

  /**
   * Logginer 을 멈추는 함수입니다.
   */
  @boundMethod
  public stop(): void {
    if (this.stopFn !== undefined) {
      this.stopFn();
      this.stopFn = undefined;
    }
  }

  private currentTime(): string {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  @boundMethod
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseActionEvent(event: any): ParsedAction {
    // object name
    const actor = event.object?.constructor.name || '?';
    // object ID
    const actorID = event.object?.id || '';
    // method name of action
    const actionName = event.name;
    // arguments of action method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const args = event.arguments.map((arg: any) => {
      // Array 도 typeof 'object' 이지만 처리 방식이 다르기에 조건문을 따로 배치
      if (Array.isArray(arg) === true) {
        // TODO: 좀 더 디테일한 정보 넣기
        return `Array[${arg.length}]`;
      }
      if (typeof arg === 'object') {
        /* serialize 가 제대로 적용된다면 그때 이 코드를 넣어보자
          if (arg instanceof Node) {
            return JSON.stringify((arg as Node).serialize());
          }
          */
        return `${arg.constructor.name}${arg.id ? `#${arg.id}` : ''}`;
      }
      return `${arg}`;
    });
    const eventArguments = args.join(', ');
    return {
      actor,
      actorID,
      actionName,
      eventArguments,
    };
  }

  @boundMethod
  private logActionEvent(parsed: ParsedAction): void {
    const { actor, actorID, actionName, eventArguments } = parsed;
    console.log(
      `[${this.currentTime()}]%c[A] %c${actor}%c${actorID ? `#${actorID}` : ''}%c.${actionName}%c(${
        eventArguments ? `${eventArguments}` : ''
      })`,
      actionStyle.prefix,
      actionStyle.actor,
      actionStyle.actorId,
      actionStyle.actionName,
      actionStyle.eventArguments
    );
  }
}

export default new MobxLogger();
