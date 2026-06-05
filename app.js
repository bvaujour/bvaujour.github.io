let skis;
let boots;
let sticks;
const API = "https://skirentalrw-production-f386.up.railway.app";
let selection =
{
	ski: { item: null, size: null },
	boot: { item: null, size: null },
	stick: { item: null, size: null }
};

const	types = ['ski', 'boot', 'stick'];

let step = 0;

function changeStep(newStep)
{
	const stepBar = document.getElementById("step-bar");
	stepBar.children[step].classList.remove("active");
	stepBar.children[step].children[0].classList.remove("active");
	stepBar.children[newStep].classList.add("active");
	stepBar.children[newStep].children[0].classList.add("active");
	step = newStep;
	render();
}

function selectItem(item, size)
{
	const	type = types[step];

	selection[type].item = item;
	selection[type].size = size;
	changeStep(step + 1)
}

function	cleanContainers()
{
	const itemContainer = document.getElementById("items");
	itemContainer.innerHTML = "";
	const sizeContainer = document.getElementById("size-selection");
	sizeContainer.innerHTML = "";
	const	confirmContainer = document.getElementById('confirm');
	confirmContainer.innerHTML = "";
}

async function confirmReservation()
{
	await fetch("/api/reserve",
	{
		method: "POST",
		headers:
		{
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			ski_id: selection['ski'].item.id,
			boot_id: selection['boot'].item.id,
			stick_id: selection['stick'].item.id,
		}),
	});
	location.reload();
}

function renderConfirm()
{
	if (selection['ski'].item === null)
		return (changeStep(0));
	if (selection['boot'].item === null)
		return (changeStep(1));
	if (selection['stick'].item === null)
		return (changeStep(2));
	const	container = document.getElementById('confirm');
	container.innerHTML =
	`
		<h1>Your Pack:</h1>
		<h2 class="selected-item">
			Ski: ${selection['ski'].item.name}(${selection['ski'].size})
		</h2>
		<h2 class="selected-item">
			Boots: ${selection['boot'].item.name}(${selection['boot'].size})
		</h2>
		<h2 class="selected-item">
			Bâtons: ${selection['stick'].item.name}(${selection['stick'].size})
		</h2>
		<button onclick="confirmReservation()">Confirmer</button>
	`;
}

function	showSize(item)
{
	const	sizeContainer = document.getElementById("size-selection");
	sizeContainer.innerHTML = "";
	for (const size of item.sizes)
	{
		const	button = document.createElement("button");
		button.className = "size-button";
		button.textContent = size;
		button.onclick = () => selectItem(item, size);
		sizeContainer.append(button);
	}
}

function renderItems(items)
{
	const itemContainer = document.getElementById("items");
	for (const item of items)
	{
		const	button = document.createElement("button");
		button.className = "card";
		
		const	name = document.createElement("h3");
		name.className = "item-name";
		name.textContent = item.name;
		
		const image = document.createElement("img");
		image.src = `${item.path}`;
		image.alt = item.name;
		
		const	stock = document.createElement("p");
		stock.textContent = "stock: " + item.stock;
		
		button.append(image, name, stock);
		button.onclick = () => showSize(item);
		if (item.stock === 0)
			button.disabled = true;
		itemContainer.append(button);
	}
}

function render()
{
	cleanContainers();
	if (step === 0)
		renderItems(skis);

	else if (step === 1)
		renderItems(boots);

	else if (step === 2)
		renderItems(sticks);

	else if (step === 3)
		renderConfirm();
}

async function loadCatalog()
{
	skis = await fetch(API + "/api/ski").then(r => r.json());
	boots = await fetch(API + "/api/boot").then(r => r.json());
	sticks = await fetch(API + "/api/stick").then(r => r.json());
	for (const ski of skis)
		ski.sizes = ski.sizes.split(',');
	for (const boot of boots)
		boot.sizes = boot.sizes.split(',');
	for (const stick of sticks)
		stick.sizes = stick.sizes.split(',');
	render();
}


loadCatalog();