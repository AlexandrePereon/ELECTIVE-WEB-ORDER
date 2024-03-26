class OrderSub {
  constructor() {
    this.subscribers = {};
  }

  subscribe(event, callback) {
    console.log('Subscribing to event', event);
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
  }

  publish(event, data) {
    console.log('Publishing event', event, data);
    if (this.subscribers[event]) {
      this.subscribers[event].forEach((callback) => {
        callback(data);
      });
    }
  }

  unsubscribe(event, callback) {
    console.log('Unsubscribing from event', event);
    if (this.subscribers[event]) {
      this.subscribers[event] = this.subscribers[event].filter((sub) => sub !== callback);
    }
  }
}

const orderSub = new OrderSub();

export default orderSub;
