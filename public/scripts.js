const Mask = {
    apply(input, func) {
        Validate.clearError(input)

        setTimeout(function() {

          input.value =  Mask[func](input.value)

        }, 1)
    },
    formatUSD(value) {
        value = value.replace(/\D/g, "")
        return new Intl.NumberFormat('en-US', {
            style: "currency",
            currency: "USD"
        }).format(value/100)
    },
    cpfCnpj(value) {
        value = value.replace(/\D/g, "")

        if (value.length > 14) value = value.slice(0, -1)

        // check if the value is cpf or cnpj
        if (value.length > 11) {
            // cnpj
            value = value.replace(/(\d{2})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1/$2")
            value = value.replace(/(\d{4})(\d)/, "$1-$2")
            
        } else {
            // cpf
            value = value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value = value.replace(/(\d{3})(\d)/, "$1-$2")
        }

        return value
    },
    cep(value) {
        value = value.replace(/\D/g, "")

        if (value.length > 8) value = value.slice(0,-1)

        value = value.replace(/(\d{5})(\d)/, "$1-$2")

        return value
    }
}

const ImagesUpload = {
    input: "",
    preview: document.querySelector('#preview-img'), // Div that shows the images
    uploadLimit: 6,
    files: [],
    handleInput(event) {
        const { files: fileList } = event.target
        ImagesUpload.input = event.target

        if (ImagesUpload.limitExceeded(ImagesUpload.input)) return false

        ImagesUpload.organizeImages(fileList)

        // Update the fileList of the input for a file list manipulated.
        ImagesUpload.input.files = ImagesUpload.getAllFiles()
    },
    putInDiv(image) {
        const div = document.createElement('div')
        div.classList.add("image")
        div.appendChild(image)
        div.appendChild(ImagesUpload.createButtonToRemoveImage())

        div.onclick = ImagesUpload.removeImage

        return div
    },
    limitExceeded(input) {
        const { files: fileList } = input
        const { uploadLimit, preview } = ImagesUpload

        if (fileList.length > uploadLimit) {
            alert(`Upload maximum ${uploadLimit} images.`)
            event.preventDefault()
            return true
        }

        const arrayOfImagesinPreview = []
        preview.childNodes.forEach(img => {
            if (img.classList && img.classList == "image") {
                arrayOfImagesinPreview.push(img)
            }
        })
        
        const totalImages = arrayOfImagesinPreview.length + fileList.length

        if (totalImages > uploadLimit) {
            alert(`Limit maximum of images ${uploadLimit}`)
            event.preventDefault()
            return true
        }
    
        return false
    },
    getAllFiles() {
        // This function is responsible to transform the array files created
        // to manipulate the files in a fileList.

        // ClipboardEvent("") refers to firefox and DataTransfer() refers to chrome.
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        ImagesUpload.files.forEach(file => dataTransfer.items.add(file))

        // returns the array files in format of fileList.
        return dataTransfer.files

    },
    organizeImages(fileList) {
        // This function replace the fileList to an array named files
        // And read the files, adding this to a tag <img>
        // After, create a div and put the image inside.
        // Put this div created inside of the div that shows the images (#preview-img), 
        // Each image created is a new div.

        fileList = ImagesUpload.input.files

        Array.from(fileList).forEach(file => { 
            ImagesUpload.files.push(file)

            const reader = new FileReader()

            reader.readAsDataURL(file)

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)
                const div = ImagesUpload.putInDiv(image)
    
                ImagesUpload.preview.appendChild(div)
            }
        })
    },
    createButtonToRemoveImage() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "delete"
        return button
    },
    removeImage(event) {
        // This function catch the event of clicking to remove (icon - buttonToRemove).
        // imageDiv refers to the father of the icon (div of the img)
        // imagesArray create an array with all images of the div#preview-img (image div included).
        // indexImage catch the index of imageDiv inside of the array.
        // After this, the splice removes this index from array files
        // Input.files is updated with the array files in format of fileList
        // imageDiv.remove() removes the image of frontend.

        const imageDiv = event.target.parentNode
        const imagesArray = Array.from(ImagesUpload.preview.children)
        const indexImage = imagesArray.indexOf(imageDiv)

        ImagesUpload.files.splice(indexImage, 1)

        ImagesUpload.input.files = ImagesUpload.getAllFiles()

        imageDiv.remove()
    },
    removeOldImage(event) {
        const imageDiv = event.target.parentNode

        if (imageDiv.id) {
            const removedImage = document.querySelector('input[name="removedImage"]')
            
            // put a value in the input hidden to catch in backend all the files id removed.
            // concatenate with "," to transform in an array after.
            if (removedImage) removedImage.value += `${imageDiv.id},`
        }

        imageDiv.remove()
    }
}

const ImagesPreview = {
    miniatures: document.querySelectorAll('.preview-gallery img'),
    highlight: document.querySelector('.gallery .highlight > img'),
    miniatureTurnsHighlight (event) {
        for (miniature of ImagesPreview.miniatures) {
            miniature.classList.remove("active")
        }

        ImagesPreview.highlight.src = event.target.src
        event.target.classList.add("active")
    }
}

const Lightbox = {
    classLightbox: document.querySelector(".lightbox"),
    imageLightbox: document.querySelector(".lightbox img"),
    closeLightboxIcon: document.querySelector(".lightbox a i"),
    open(e) {
        Lightbox.imageLightbox.src = e.target.src
        Lightbox.classLightbox.style.opacity = 1
        Lightbox.classLightbox.style.top = 0
        Lightbox.closeLightboxIcon.style.top = 0
    },
    close() {
        Lightbox.classLightbox.style.opacity = 0
        Lightbox.classLightbox.style.top = "-100%"
        Lightbox.closeLightboxIcon.style.top = "-8px"
    },
    closeModal() {
        Lightbox.classLightbox.style.opacity = 0
        Lightbox.classLightbox.style.top = "-100%"
        Lightbox.closeLightboxIcon.style.top = "-8px"
    }
}

const Redirect = {
    divImageClickTo(id) {
        window.location = `/products/${id}`
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearError(input)

        let results =  Validate[func](input.value)
        input.value = results.value

        if (results.error) {
            Validate.displayError(input, results.error)
        }
    },

    displayError(input, error) {
        const div = document.createElement("div")
        div.classList.add("error")
        div.innerHTML = error

        input.parentNode.appendChild(div)

        // don't let the user exit the input until valid email. 
        input.focus()
    },

    clearError(input) {
        const divError = input.parentNode.querySelector('.error')

        if (divError) {
            divError.remove()
        }

    },

    isEmail(value) {
        let error = null

        // regex of email
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat)) error = "This email is not valid."

        return {
            error,
            value
        }
    },
    
    isCpfCnpj(value) {
        let error = null

        const numbersOfCpfCnpj = value.replace(/\D/g, "")

        if (numbersOfCpfCnpj.length > 11 && numbersOfCpfCnpj.length !== 14) {
            error = "Invalid CNPJ"
        }
        else if (numbersOfCpfCnpj.length < 11) {
            error = "Invalid CPF"
        }

        return {
            error, 
            value
        }
    },

    isCep(value) {
        let error = null

        const numbersOfCep = value.replace(/\D/g, "")
        console.log(numbersOfCep.length)
        if (numbersOfCep.length !== 8) {
            error = "Invalid CEP"
        }

        return {
            error, 
            value
        }
    },

    fields(event) {
        const items = document.querySelectorAll(".item input, .item textarea, .item select")

        for (item of items) {
            console.log(item)
            if (!item.value && item.name != "removedImage") {
                const message = document.createElement('div')
                message.classList.add("message")
                message.classList.add("error")
                message.innerHTML = "Please fill in all fields."

                document.querySelector('body').append(message)

                event.preventDefault()
                break
            }
        }
    }
}