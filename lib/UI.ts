import * as readline from 'readline-sync';

export abstract class UIComponent {
  protected readonly rawContent: string;

  constructor(content: string) {
    this.rawContent = content;
  }

  /**
   * action excuted by component
   * @abstract
   */
  abstract action(): string | undefined;

  /**
   * evaluate and output eval()
   * @param input string to evaluate
   */
  private output(input?: string | void): void {
    if (input) {
      console.log(eval(input));
    }
  }

  /**
   * process input, concantenate relevant data, call action method, and output result
   * @param identifiers Javascript identifier prefixes
   * @param globalState all previous relevant expressions & statements
   * @returns updated global state array
   */
  public render(identifiers: string[], globalState: string[]): string[] {

    /**
     * filter out relevant global variables and objects
     * @param prevLines previously executed statements or expressions
     * @returns string containing all relevant identifier declarations
     */
    function filterIdentifiers(prevLines: string[]): string {
      const accumulator = [];
      for (const line of prevLines) {
        for (const ident of identifiers) {
          if (line.startsWith(ident + " ")) {
            accumulator.push(line);
            break;
          } else if (line.match(/[a-zA-Z0-9]+\s+\=\s+.+/)?.length) {
            accumulator.push(line);
            break;
          }
        }
      }
      return accumulator.join(";") + ";";
    }

    if (!process.stdout.write(`${this.rawContent}`)) {
      throw new Error("could not write to stdout");
    }
    const result = this.action();
    const ident = filterIdentifiers(globalState);
    globalState.push(result ?? "");
    try {
      this.output(ident + globalState[globalState.length - 1]);
    } catch (error: any) {
      console.log(error.message);
      globalState.pop();
    } return globalState;
  }
}

export class Prompt extends UIComponent {
  constructor(content: string) {
    super(content);
  }

  /**
   * action implementation for UIComponent
   * @returns string read from stdin
   */
  public action(): string {
    return readline.question();
  }
}
