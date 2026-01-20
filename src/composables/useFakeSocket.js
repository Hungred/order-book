import { ref } from 'vue';

function rndPrice(base = 10000, spread = 50) {
  return +(base + (Math.random() - 0.5) * spread).toFixed(1);
}
function rndAmount() {
  return +(Math.random() * 5).toFixed(1);
}

export default function useFakeSocket({ interval = 800 } = {}) {
  const onData = ref(null);
  let timer = null;

  function start() {
    timer = setInterval(() => {
      // produce a batch of new orders (buys and sells)
      const bids = Array.from({ length: 5 }, () => ({
        id: Date.now() + Math.random(),
        price: rndPrice(100, 10),
        amount: rndAmount(),
      }));
      const asks = Array.from({ length: 5 }, () => ({
        id: Date.now() + Math.random(),
        price: rndPrice(100, 10),
        amount: rndAmount(),
      }));
      onData.value && onData.value({ bids, asks, time: Date.now() });
      console.log('產生假買賣單');
    }, interval);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function setHandler(fn) {
    onData.value = fn;
  }

  return { start, stop, setHandler };
}
