
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
 * @param a1 array 1
 * @param a2 array 2
 * @return boolean
 */
export function areArraysEqualSets(a1, a2): boolean {
    const superSet = {};
    for (const i of a1) {
        const e = i + typeof i;
        superSet[e] = 1;
    }

    for (const i of a2) {
        const e = i + typeof i;
        if (!superSet[e]) {
            return false;
        }
        superSet[e] = 2;
    }

    for (const e in superSet) {
        if (superSet[e] === 1) {
            return false;
        }
    }

    return true;
}
