class Debouncer {
  queuedExecution?: NodeJS.Timeout;
  timeout: number;

  constructor(timeout: number = 500) {
    this.timeout = timeout;
  }

  queue(fn: (...args: any) => any) {
    clearTimeout(this.queuedExecution);
    this.queuedExecution = setTimeout(fn, this.timeout);
  }
}

export default Debouncer;
