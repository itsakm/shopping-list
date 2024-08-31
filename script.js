const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const filter = document.getElementById('filter')
const itemClear = document.getElementById('clear')
const formBtn = itemForm.querySelector('button');
let isEditMode = false;


function displayItems() {
    const itmesFromStorage = getItemFromStorage();
    itmesFromStorage.forEach((item) => {
        addItemtoDom(item);
    })
    checkUI()
}


function onAddItemSubmit(e) {
    e.preventDefault();
    const newItem = itemInput.value;

    //validate
    if (newItem === '') {
        alert('Please add an item')
        return;
    }

    //check for edit mode

    if(isEditMode)
    {
        const itemToEdit = itemList.querySelector('.edit-mode');
        console.log(newItem)
        if(checkIfItemExists(newItem))
            {
                alert('Item already exists,Use different name!');
                return;
            }
               

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }
    else{
        if(checkIfItemExists(newItem))
        {
            alert('Item already exists');
            itemInput.value = '';
            return;
        }
            

    }

    addItemtoDom(newItem)
    addItemtoLocalStorage(newItem)
    checkUI()

    itemInput.value = '';
}


function addItemtoLocalStorage(item) {
    let itmesFromStorage = getItemFromStorage();
    itmesFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itmesFromStorage));
}


function getItemFromStorage() {
    let itmesFromStorage;

    if (localStorage.getItem('items') === null) {
        itmesFromStorage = [];
    }
    else {
        itmesFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itmesFromStorage;
}


function addItemtoDom(item) {

    //create list item
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item))

    const button = createButton('remove-item btn-link text-red');

    li.appendChild(button)

    itemList.appendChild(li)

}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    return button
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function onClickItem(e)
{
    if (e.target.parentElement.classList.contains('remove-item'))
    {
        removeItem(e.target.parentElement.parentElement);
    }
    else
    {
        setItemToEdit(e.target)
    }

}

function setItemToEdit(item)
{
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;

}

function removeItem(item) {
    //remove item form DOM
    item.remove();

    //remove item from storage
    removeItemFromStorage(item.textContent);
    checkUI()
}

function removeItemFromStorage(itemText)
{
    let itmesFromStorage = getItemFromStorage();

    //Filter out item to be removed
    itmesFromStorage = itmesFromStorage.filter((i) => i!== itemText);

    //reset to localstorage
    localStorage.setItem('items',JSON.stringify(itmesFromStorage));
}

function clearItems(e) {
    // itemList.innerHTML = '';

    if (confirm("Are you really want to clear!!")) {
        while (itemList.firstChild) {
            itemList.removeChild(itemList.firstChild)
        }
    }

    localStorage.removeItem('items');
    checkUI()
}


function checkUI() {

    itemInput.value = '';
    const items = itemList.querySelectorAll('li')
    if (items.length === 0) {
        itemClear.style.display = 'none';
        filter.style.display = 'none';

    }
    else {
        itemClear.style.display = 'block';
        filter.style.display = 'block';

    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

function filterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        }
        else {
            item.style.display = 'none';
        }

    })

}

function checkIfItemExists(item)
{
    const itmesFromStorage = getItemFromStorage();
    return itmesFromStorage.includes(item);

}
//Event Listeners
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
itemClear.addEventListener('click', clearItems);
filter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems)

checkUI();