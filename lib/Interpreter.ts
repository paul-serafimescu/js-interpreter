import * as UI from './UI';

export interface IConfig {
  readonly promptCharacter: string;
  readonly identifiers: string[];
  readonly welcomeMessage?: string;
}

export default class Interpreter {
  private readonly workflow: UI.UIComponent[];
  private state: string[];
  private readonly identifiers: string[];
  private readonly welcomeMessage?: string;

  constructor(config: IConfig) {
    this.workflow = [new UI.Prompt(`${config.promptCharacter} `)];
    this.identifiers = config.identifiers;
    this.state = new Array();
    this.welcomeMessage = config.welcomeMessage;
  }

  /**
   * render the welcome message
   * @throws {Error}
   */
  private renderWelcome(): void {
    if (!process.stdout.write(this.welcomeMessage ?? "")) {
      throw new Error(/* idk idc */);
    }
  }

  /**
   * run the interpreter
   * @returns {never} main loop
   */
  public run(): never {
    this.renderWelcome();
    while (true) {
      for (const item of this.workflow) {
        try { this.state = item.render(this.identifiers, this.state); } catch (error: any) {
          console.error(error.message);
        }
      }
    }
  }
}
