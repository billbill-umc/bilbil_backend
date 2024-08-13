export class Counter {
    constructor(startNum) {
        this.startNum = startNum;
        this.count = startNum;
    }

    next() {
        return this.count++;
    }
}
