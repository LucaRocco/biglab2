const filterNames = {
    all: 'all',
    favorites: 'favorites',
    bestRated: 'best_rated',
    seenLastMonth: 'seen_last_month',
    unseen: 'unseen'
}

const filterNamesArray = ['all', 'favorites', 'best_rated', 'seen_last_month', 'unseen'];

function underscoreToUpperCase(string) {
    return string.replaceAll('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export { filterNames, filterNamesArray, underscoreToUpperCase };