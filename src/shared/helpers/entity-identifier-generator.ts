
import * as moment from 'moment';

enum EntityPrefix {
    CASE = 'CA'
}

export class EntityIdentifierGeneratorClass {

    constructor() {}

    generateNextCaseIdentifier(lastCaseIdentifier: string|null = null): string {

        const entity = EntityPrefix.CASE;
        const month = moment().format('MM');
        const year = moment().format('YY');

        let sequenceNumber = 0;
        if (lastCaseIdentifier)
            sequenceNumber = parseInt(lastCaseIdentifier.substring(6), 10) + 1;

        let sequenceNumberString = sequenceNumber.toString(10);
        if (sequenceNumberString.length < 4) {
            let dif = '';
            for (let i = 0; i < 4 - sequenceNumberString.length; ++i) {
                dif += '0';
            }
            sequenceNumberString = dif + sequenceNumberString;
        }

        return entity + month + year + sequenceNumberString;

    }

}

export default new EntityIdentifierGeneratorClass();
