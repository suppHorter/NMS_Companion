class Popup {
    constructor() {
        this.popupId = "popup";
        this.popupBackgroundId = "popup_bg";
    }

    show(content) {
        let stage = document.getElementById("b");
        let popup = document.createElement("div");
        let popupBackground = document.createElement("div");
        let exitButton = document.createElement("button");

        popup.id = this.popupId;
        popupBackground.id = this.popupBackgroundId;
        popup.setAttribute("class", "popup");
        popupBackground.setAttribute("class", "popup_background");
        exitButton.addEventListener('click', () => {
            this.hide();
        });
        
        popupBackground.addEventListener('click', () => {
            this.hide();
        });

        exitButton.innerHTML = "X";
        exitButton.setAttribute("class", "btn btn-danger popup_close");

        popup.appendChild(exitButton);
        popup.appendChild(content);
        stage.appendChild(popupBackground);
        stage.appendChild(popup);
    }

    hide() {
        document.getElementById(this.popupId).remove();
        document.getElementById(this.popupBackgroundId).remove();
    }
}