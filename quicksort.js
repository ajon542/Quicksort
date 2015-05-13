module.exports = quicksort;

function swap(items, a, b) {
    var temp = items[a];
    items[a] = items[b];
    items[b] = temp;

    swapCallback(a, b);
}

var swapCallback;

function quicksort(items, callbackFn) {
    swapCallback = callbackFn;
    sort(items, 0, items.length - 1);
}

function sort(items, left, right) {
    
    var index;
    
    if (items.length > 1) {
        
        index = partition(items, left, right);

        if (left < index - 1) {
            sort(items, left, index - 1);
        }
        
        if (index < right) {
            sort(items, index, right);
        }

    }
    
    return items;
}

function partition(items, left, right) {
    
    var pivot = items[Math.floor((right + left) / 2)],
        i = left,
        j = right;
    
    
    while (i <= j) {
        
        while (items[i] < pivot) {
            i++;
        }
        
        while (items[j] > pivot) {
            j--;
        }
        
        if (i <= j) {
            swap(items, i, j);
            
            i++;
            j--;
        }
    }
    
    return i;
}
