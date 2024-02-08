import { Repository } from 'typeorm';

export class BaseRelayRepository<T> extends Repository<T> {}