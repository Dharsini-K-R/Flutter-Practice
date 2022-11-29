/**
 * Just mocking out with an empty module to prevent tests failing
 */
const drop = jest.fn();
const drag = jest.fn();

const dnd = {
  useDrag(test) {
    return [{ isDragging: false }, drag];
  },
  useDrop() {
    return [null, drop];
  },
};

module.exports = dnd;
