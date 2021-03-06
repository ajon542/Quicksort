﻿module.exports = quicksort;

// http://algs4.cs.princeton.edu/23quicksort/

function swap(items, a, b) {
    
    swapCallback(a, b);

    var temp = items[a];
    items[a] = items[b];
    items[b] = temp;
}

function compare(a, b) {
    
    compareCallback(a, b);
    
    return a < b;
}

var swapCallback;
var compareCallback;

function quicksort(items, swapCallbackFn, compareCallbackFn) {
    swapCallback = swapCallbackFn;
    compareCallback = compareCallbackFn;
    sort(items, 0, items.length - 1);
}

function sort(items, left, right) {
    
    var index;
    
    if (items.length > 1) {
        
        index = partition(items, left, right);
        
        if (compare(left, index - 1)) {
            sort(items, left, index - 1);
        }
        
        if (compare(index, right)) {
            sort(items, index, right);
        }
    }
    
    return items;
}

function partition(items, left, right) {
    
    var pivot = items[(left + right) >> 1],
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
