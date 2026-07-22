import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)
        .forEach((elementName) => {
            elements[elementName].innerHTML = '';
            
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Все';
            elements[elementName].append(defaultOption);
            
            Object.values(indexes[elementName])
                .forEach(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    elements[elementName].append(option);
                });
        });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field;
            
            if (fieldName && elements[fieldName]) {
                elements[fieldName].value = '';
                state[fieldName] = '';
            } else {
                Object.keys(elements).forEach(key => {
                    if (elements[key]) {
                        elements[key].value = '';
                        state[key] = '';
                    }
                });
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        let filteredData = data.filter(row => compare(row, state));
        if (state.totalFrom && !isNaN(parseFloat(state.totalFrom))) {
            const fromValue = parseFloat(state.totalFrom);
            filteredData = filteredData.filter(row => {
                const total = parseFloat(row.total);
                return !isNaN(total) && total >= fromValue;
            });
        }

        if (state.totalTo && !isNaN(parseFloat(state.totalTo))) {
            const toValue = parseFloat(state.totalTo);
            filteredData = filteredData.filter(row => {
                const total = parseFloat(row.total);
                return !isNaN(total) && total <= toValue;
            });
        }

        return filteredData;
    }
}