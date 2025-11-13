import { ref } from 'vue';

function rndPrice(base=10000, spread=50){ return +(base + (Math.random()-0.5)*spread).toFixed(2); }
function rndAmount(){ return +(Math.random()*5).toFixed(4); }

export default function useFakeSocket({interval=800} = {}) {
  const onData = ref(null);
  let timer = null;

  function start() {
    timer = setInterval(()=> {
      // produce a batch of new orders (buys and sells)
      const bids = Array.from({length:5}, ()=>({ id: Date.now()+Math.random(), price: rndPrice(100000,200), amount: rndAmount() }));
      const asks = Array.from({length:5}, ()=>({ id: Date.now()+Math.random(), price: rndPrice(100020,200), amount: rndAmount() }));
      onData.value && onData.value({ bids, asks, time: Date.now() });
    }, interval);
  }

  function stop(){ if(timer) clearInterval(timer); timer = null; }

  function setHandler(fn){ onData.value = fn; }

  return { start, stop, setHandler };
}
