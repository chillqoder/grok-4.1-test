export function pLimit(concurrency: number) {
  let activeCount = 0;
  const queue: Array<() => void> = [];

  return (fn: () => Promise<any>) =>
    new Promise((resolve, reject) => {
      const run = async () => {
        try {
          await fn();
          resolve(undefined);
        } catch (err) {
          reject(err);
        } finally {
          activeCount--;
          if (queue.length > 0) {
            queue.shift()!();
          }
        }
      };

      const task = () => {
        activeCount++;
        run();
      };

      if (activeCount < concurrency) {
        task();
      } else {
        queue.push(task);
      }
    });
}
