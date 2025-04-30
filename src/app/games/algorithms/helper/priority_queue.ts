
// A min-heap data structure
export class PriorityQueue<T> {
    private heap: { priority: number, item: T }[] = [];

    enqueue(item: T, priority: number): void {
        this.heap.push({ priority, item });
        this.bubbleUp(this.heap.length - 1);
    }

    dequeue(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        this.swap(0, this.heap.length - 1);
        const item = this.heap.pop()?.item;
        this.bubbleDown(0);
        return item;
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    peek(): T | undefined {
        return this.heap[0]?.item;
    }

    size(): number {
        return this.heap.length;
    }

    clear(): void {
        this.heap = [];
    }

    private swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    //  Helper function to maintain the min-heap property by bubbling up.
    private bubbleUp(index: number): void {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].priority >= this.heap[parentIndex].priority) {
                break;
            }
            this.swap(index, parentIndex);
            index = parentIndex;
        }
    }

    // Helper function to maintain the min-heap property by bubbling down.
    private bubbleDown(index: number): void {
        while (true){
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let smallest = index;

            if (
                leftChildIndex < this.heap.length &&
                this.heap[leftChildIndex].priority < this.heap[smallest].priority
            ){
                smallest = leftChildIndex
            }

            if (
                rightChildIndex < this.heap.length &&
                this.heap[rightChildIndex].priority < this.heap[smallest].priority
            ){
                smallest = rightChildIndex
            }

            if (smallest === index) {
                break;
            }
            this.swap(index, smallest);
            index = smallest;
        }

    }
}