
class Utils {

    constructor() {}

    /**
     * check if <obj> is an empty object (equal to {})
     */
    isEmptyObj(obj: any): boolean {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    /**
     * check if <obj> is a non-null object
     */
    isNonNullObject(obj: any): boolean {
        if (this.isArray(obj))
            return false;
        return typeof obj === 'object' && obj !== null;
    }

    /**
     * check if <arr> is an array
     */
    isArray(arr: any[]): boolean {
        return Array.isArray(arr);
    }



}

export default new Utils();
