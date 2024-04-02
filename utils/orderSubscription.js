class OrderSub {
  constructor() {
    this.subscribers = {};
  }

  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
  }

  publish(event, ...args) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach((callback) => {
        callback(...args);
      });
    }
  }

  unsubscribe(event, callback) {
    if (this.subscribers[event]) {
      this.subscribers[event] = this.subscribers[event].filter((sub) => sub !== callback);
    }
  }
}

const orderSub = new OrderSub();

export default orderSub;
