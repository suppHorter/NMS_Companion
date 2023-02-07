class Refine {
    constructor(stageId) {
        this.stageId = stageId;
        this.stage = document.getElementById(this.stageId);   
        this.config = new ItemConfig();
        this.item_handler = new Items();
        this.api_service = new Service_API();
        this.items = this.config.items_refine;
        this.refineStepsStage = null;
        this.itemMultiplier = 1;

        this.refineSteps = [];
    }

    getItemSelect() {
        let container = document.createElement('div');
        let itemSelect = document.createElement('select');
        let amount = document.createElement('input');

        container.setAttribute('class', 'text-center');
        container.setAttribute('style', 'max-width: 16%; margin: 20px');

        itemSelect.setAttribute("class", "btn btn-secondary btn-sm dropdown-toggle");
        itemSelect.addEventListener('change', (e) => {
            this.deleteRecipe();
            this.refineStepsStage.appendChild(this.getItemContainer(this.items[e.target.selectedIndex]));
            this.refineSteps = [[ {data: { item: this.items[e.target.selectedIndex]}, has_button: true} ]];
        });

        for (let i=0; i<this.items.length; i++) {
            let item_option = document.createElement('option');
            item_option.value = this.items[i].name;
            item_option.innerHTML = this.items[i].name;
            itemSelect.appendChild(item_option);
        }

        amount.type = "number";
        amount.min = 0;
        amount.value = 1;
        amount.setAttribute("style", "width: 90%; font-size: 20px; font-weight: bold;");
        amount.addEventListener('change', (e) => {
            this.itemMultiplier = e.target.value;
            this.drawRefineSteps();
        });

        container.appendChild(amount);
        container.appendChild(itemSelect);
        return container;
    }

    getItemContainer(_item, hasRecipiesButton = true) {
        let container = document.createElement('div');
        let info_text = document.createElement('text');

        container.setAttribute('class', 'text-center recipe_container');

        info_text.innerHTML = _item.name;

        container.appendChild(this.item_handler.getImagePicture(_item, 100));
        container.appendChild(info_text);

        if (_item.recipes.length > 0 && hasRecipiesButton) {
            let button = document.createElement('button');
            button.innerHTML = "get recipies";
            button.setAttribute("class", "btn btn-primary");
            button.addEventListener('click', () => {
                this.item_handler.showRecipes(_item, (itemRecipe) => {
                    this.addToRefineSteps(itemRecipe);
                    this.drawRefineSteps();
                });
            });
            container.appendChild(button);
        }

        return container;
    }

    drawRefineSteps() {
        let container = document.getElementById(this.stageId + "_recipe");
        let table = document.createElement('table');

        container.innerHTML = "";

        for(let i = 0; i < this.refineSteps.length; i++) {
            let tr = document.createElement('tr');
            let step_items = this.refineSteps[i];

            for (let j = 0; j < step_items.length; j++) {
                let td = document.createElement('td');
                let amount_needed = document.createElement("p");
                let amount_output = document.createElement("p");

                if (step_items[j].output_amount) {
                    amount_output.innerHTML = "O: " + step_items[j].output_amount * this.itemMultiplier;
                    td.appendChild(amount_output);
                }
                if (step_items[j].data.needed_amount) {
                    amount_needed.innerHTML = "I: " + step_items[j].data.needed_amount * this.itemMultiplier;
                    td.appendChild(amount_needed);
                }

                td.appendChild(this.getItemContainer(step_items[j].data.item, step_items[j].has_button));
                tr.appendChild(td);
                
            }
            table.appendChild(tr);
        }
        container.appendChild(table);
    }

    deleteRecipe() {
        this.refineSteps = [];
        document.getElementById(this.stageId + "_recipe").innerHTML = "";
    }

    addToRefineSteps(recipe) {
        let _newItems = [];

        for (let i = 0; i < recipe.ingredients.length; i++) {
            let new_item = this.item_handler.getItemByName(recipe.ingredients[i][0]);
            _newItems.push({
                data: {
                    item: new_item,
                    needed_amount: recipe.ingredients[i][1]
                },
                output_amount: recipe.output_amount,
                has_button: true
            });
        }
        this.refineSteps.push(_newItems);
        console.log(this.refineSteps);
    }

    show() {
        this.refineStepsStage = document.createElement("div");
        this.refineStepsStage.id = this.stageId + "_recipe";

        this.stage.appendChild(this.getItemSelect());
        this.stage.appendChild(this.refineStepsStage);
    }
}