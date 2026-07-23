import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison({
        skipEmptyTargetValues: true,
        searchMultipleFields: rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    });

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        const searchValue = state[searchField];
        
        if (!searchValue || !searchValue.trim()) {
            return data;
        }

        const filteredData = data.filter(row => {
            const comparisonState = {
                ...state,
                [searchField]: searchValue.trim()
            };
            
            return compare(row, comparisonState);
        });

        // Если нет совпадений, показываем все данные (как будто поиска не было)
        return filteredData.length === 0 ? data : filteredData;
    }
}