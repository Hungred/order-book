import useFakeSocket from './useFakeSocket';
import { useOrderBookStore } from '@/stores/orderBook';

export default function useOrderBook() {
  const store = useOrderBookStore();
  const fakeSocket = useFakeSocket({interval:700});

  fakeSocket.setHandler((msg) => {
    // msg: {bids, asks, time}
    store.applyUpdate(msg.bids, msg.asks);
  });

  function start() { fakeSocket.start(); }
  function stop() { fakeSocket.stop(); }
  function place(order){ store.placeOrder(order); }

  return { start, stop, place, bids: store.bids, asks: store.asks, trades: store.trades };
}
