export default function RuleProvider(eventBus) {
  this.mock = jest.fn();
  this.addRule = (key, fn) => {
    this.mock();
  };
}
