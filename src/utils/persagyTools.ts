import { Crypto, System, SystemStorage } from 'persagy-tools'

const conf = {
  key: '1234123412ABCDEF',
  iv: 'ABCDEF1234123412'
}

export const cryptoInstance = new Crypto(conf)

export const systemInstance = new System(conf)

export const storageInstance = new SystemStorage(conf)

export default { cryptoInstance, systemInstance, storageInstance }
