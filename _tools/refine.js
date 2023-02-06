class Refine {
    constructor(stageId) {
        this.stageId = stageId;
        this.config = new ItemConfig();
        this.item_handler = new Items();
        this.items = this.config.items_refine;
        this.api_service = new Service_API();
    }

    getItemContainer(item_index = 0) {
        let container = document.createElement('div');
        let info_img = document.createElement('img');
        let amount = document.createElement('input');
        let items = document.createElement('select');
        let button = document.createElement('button');
        let removeCard = document.createElement('button');
        let info_text = document.createElement('text');

        container.setAttribute('class', 'card text-center');
        container.setAttribute('style', 'max-width: 16%; margin: 20px');

        amount.type = "number";
        amount.min = 0;
        amount.value = 1;
        amount.setAttribute("style", "width: 50px");
        
        info_img.setAttribute('class', "float-right img-thumbnail");
        info_img.setAttribute('style', "width: 100px; cursor: pointer;");

        for (let i=0; i<this.items.length; i++) {
            let item_option = document.createElement('option');
            item_option.value = this.items[i].name;
            item_option.innerHTML = this.items[i].name;
            items.appendChild(item_option);
        }

        let showItemInfo = (i) => {
            let item = this.items[i];
            info_img.src = this.config.items_refine_img_url + item.src;
            info_img.href = this.config.items_refine_url + item.name;
            info_img.addEventListener('click', () => {
                window.open(info_img.href, '_blank').focus();
            });
        }

        items.setAttribute("class", "btn btn-secondary btn-sm dropdown-toggle");
        items.addEventListener('change', (e) => {
            showItemInfo(e.target.selectedIndex);
        });
        
        button.innerHTML = "get recipies";
        button.setAttribute("class", "btn btn-primary");
        button.addEventListener('click', () => {
            this.item_handler.showRecipes(this.items[item_index]);
        });
        
        removeCard.innerHTML = "X";
        removeCard.setAttribute("class", "btn btn-danger");

        removeCard.addEventListener('click', () => {
            container.remove();
        });
        
        container.appendChild(removeCard);
        container.appendChild(amount);
        container.appendChild(items);
        container.appendChild(info_img);
        container.appendChild(button);
        container.appendChild(info_text);

        showItemInfo(item_index);
        
        return container;
    }

    show() {
        let stage = document.getElementById(this.stageId);
        let button = document.createElement('button');
        
        button.innerHTML = "+";
        button.setAttribute("class", "btn btn-primary");
        button.setAttribute("style", "height: 40px");

        button.addEventListener('click', () => {
            stage.appendChild(this.getItemContainer());
        });

        stage.appendChild(button);       

        stage.appendChild(this.getItemContainer());
        
    }
}