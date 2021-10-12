import Interpreter from './Interpreter';
import config from './config';

export function main() {
  const interpreter = new Interpreter(config);
  interpreter.run();
}

if (require.main === module) {
  main();
}
