import * as Permissions from 'expo-permissions';
import { withEffect } from './';

const isGranted = r => r.status === 'granted'
const getPermission = (...p) => Permissions.getAsync(...p)
  .then(r => isGranted(r) ? r : Permissions.askAsync(...p))
  .then(r => !isGranted(r) && Promise.reject(p + ' is not permitted.'))

export const withPermission = (...p) =>
  withEffect(() => getPermission(...p), null, [])
