// Node.js EventEmitter singleton (pub/sub bus)
import { EventEmitter } from 'events';

class EventBus extends EventEmitter {}

export default new EventBus();
