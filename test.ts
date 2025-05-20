import * as os from 'node:os';
import * as deps from './src/utils/dependencies.js';

const { checkOs, checkDependencies } = deps;

const validPlatforms = ['darwin', 'linux', 'win32', 'aix', 'freebsd', 'openbsd', 'sunos'];

describe('checkOs', () => {
       test('matches os.platform and returns a known platform', () => {
               const directOs = os.platform();
               const funcOs = checkOs();

               expect(funcOs).toBe(directOs);
               expect(validPlatforms).toContain(funcOs);
       });
});

describe('checkDependencies', () => {
       afterEach(() => {
               jest.restoreAllMocks();
       });

       test('returns an array of dependency statuses', async () => {
               jest.spyOn(deps, 'checkDocker').mockResolvedValue(true);
               jest.spyOn(deps, 'checkPulumi').mockResolvedValue(false);
               jest.spyOn(deps, 'checkNixpacks').mockResolvedValue(true);

               const result = await checkDependencies();

               expect(result).toEqual([
                       { name: 'Docker', isInstalled: true },
                       { name: 'Pulumi', isInstalled: false },
                       { name: 'Nixpacks', isInstalled: true },
               ]);
       });
});
