
/**
 * for every element in an array that exists more than once, remove extra elements
 *
 * @return the modified array
 */
export function removeArrayDuplicates(arr: any[]): any[] {
    return arr.filter((item, pos) => {
        // tslint:disable-next-line:triple-equals
        return arr.indexOf(item) == pos;      // remove duplicated elements
    });
}

/**
 * return true if the arrays <a1> and <a2> contain the same elements, regardless of their order.
 * otherwise, return false.
 *
 * assumes that <a1> and <a2> are arrays, and that they both contain only primitive values.
 *
 * @param a1
 * @param a2
 * @return boolean
 */
export function areArraysEqualSets(a1, a2): boolean {
    let superSet = {};
    for (let i = 0; i < a1.length; i++) {
        const e = a1[i] + typeof a1[i];
        superSet[e] = 1;
    }

    for (let i = 0; i < a2.length; i++) {
        const e = a2[i] + typeof a2[i];
        if (!superSet[e]) {
            return false;
        }
        superSet[e] = 2;
    }

    for (let e in superSet) {
        if (superSet[e] === 1) {
            return false;
        }
    }

    return true;
}
