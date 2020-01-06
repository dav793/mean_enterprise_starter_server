
const nconf = require('nconf');
nconf.argv()
    .env()
    .file({ file: 'config/config.json' });

class ConfigLayer {

    private sysEnv: 'local'|'docker';

    constructor() {
        this.sysEnv = nconf.get('SYS_ENV');
    }

    public get(query: string, bypassSysEnv = false): any {

        if (bypassSysEnv)
            return nconf.get(query);

        let result;
        switch (this.sysEnv) {
            case 'local':
                result = nconf.get('LOCAL:' + query);
                break;
            case 'docker':
                result = nconf.get('DOCKER:' + query);
                break;
            default:
                result = nconf.get('LOCAL:' + query);
        }

        return result;

    }

}

export default new ConfigLayer();
