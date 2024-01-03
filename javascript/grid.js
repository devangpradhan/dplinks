import {
  randomBias,
  randomSnap,
  random,
  createQtGrid,
  map
} from "https://cdn.skypack.dev/@georgedoescode/generative-utils";
import debounce from "https://cdn.skypack.dev/debounce@1.2.1";

gsap.registerPlugin(Flip);

const gridElement = document.querySelector(".grid");

const width = 1080;
const height = 1080;

const mousePos = {
  x: 0,
  y: 0
};

let isAnimating = false;

// create an initial quadtree grid
let lastGrid = generateGrid({
  x: random(0, width),
  y: random(0, height)
});

// set the grid column/rows for each element in the grid and create the elements
lastGrid.areas.forEach((area, index) => {
  const el = document.createElement("div");

  el.style.gridColumn = `${area.col.start + 1} / ${area.col.end + 1}`;
  el.style.gridRow = `${area.row.start + 1} / ${area.row.end + 1}`;

  area.el = el;

  gridElement.appendChild(el);
});

// drop some images onto the grid
const imageUrls = [
  "https://images.unsplash.com/photo-1481253127861-534498168948?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTU4NDc0OA&ixlib=rb-1.2.1&q=85&w=1024",
  "https://images.unsplash.com/photo-1483959651481-dc75b89291f1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTU4NTI4OQ&ixlib=rb-1.2.1&q=85&w=1024",
  "https://images.unsplash.com/photo-1525438160292-a4a860951216?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTU4NDc0OA&ixlib=rb-1.2.1&q=85&w=1024",
  "https://images.unsplash.com/photo-1563192504-36ac622196dd?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTU4NDc5OA&ixlib=rb-1.2.1&q=85&w=1024",
  "https://images.unsplash.com/photo-1509018877337-3af7dd307ea9?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTU4NDgwOA&ixlib=rb-1.2.1&q=85&w=1024",
  "https://images.unsplash.com/photo-1498322787346-775f77e49b2e?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTU4NDgyNQ&ixlib=rb-1.2.1&q=85&w=1024",
  "https://images.unsplash.com/photo-1532456745301-b2c645d8b80d?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTU4NTE2NQ&ixlib=rb-1.2.1&q=85&w=1024"
];

for (let i = 0; i < imageUrls.length; i++) {
  const area = random(lastGrid.areas.filter((a) => !a.taken));

  area.el.style.backgroundImage = `url(${imageUrls[i]})`;
  area.el.style.filter = "grayscale(1)";

  // mark areas as "taken" so that they are not used twice
  area.taken = true;
}

// add a little instruction to one of the cells
const instructionCell = random(lastGrid.areas.filter((a) => !a.taken));
instructionCell.taken = true;
instructionCell.el.innerHTML = "MOVE THE POINTER!";
instructionCell.el.classList.add("instruction");

// add a splash of color to one of the cells
const colorCell = random(lastGrid.areas.filter((a) => !a.taken));
colorCell.taken = true;
colorCell.el.style.background = "yellow";

// add some random words to the grid
["GSAP", "FLIP!", "GRIDS", "GENERATIVE"].map((word, idx) => {
  const choice = random(lastGrid.areas.filter((a) => !a.taken));

  choice.el.innerHTML = word;

  choice.taken = true;
});

// add some shapes to all remaining areas
lastGrid.areas
  .filter((a) => !a.taken)
  .forEach((area) => {
    if (random(0, 1) > 0.375) {
      switch (random(["left", "right", "bottom", "top"])) {
        case "top":
          area.el.style.borderTop = "var(--stroke-width) solid #000";
          break;
        case "left":
          area.el.style.borderLeft = "var(--stroke-width) solid #000";
          break;
        case "bottom":
          area.el.style.borderBottom = "var(--stroke-width) solid #000";
          break;
        case "right":
          area.el.style.borderRight = "var(--stroke-width) solid #000";
          break;
      }
    } else {
      if (random(0, 1) > 0.25) {
        area.el.classList.add("circle");

        if (random(0, 1) > 0.75) {
          area.el.classList.add("circle--outline");
        }
      }
    }
  });

function updateItems() {
  const focus = {
    x: mousePos.x,
    y: mousePos.y
  };

  // save the current state
  const state = Flip.getState(".grid div", {
    props: "backgroundImage"
  });

  // generate a new grid with the same amount of cells
  let grid2;

  while (grid2?.areas.length !== lastGrid.areas.length) {
    grid2 = generateGrid(focus);
  }

  // update the grid cols/rows of each cell
  gridElement.querySelectorAll("div").forEach((el, idx) => {
    const area = grid2.areas[idx];

    if (!area) return;

    el.style.gridColumn = `${area.col.start + 1} / ${area.col.end + 1}`;
    el.style.gridRow = `${area.row.start + 1} / ${area.row.end + 1}`;
  });

  // FLIP!
  Flip.from(state, {
    duration: 1.25,
    ease: "power4.inOut",
    absolute: true,
    simple: false,
    stagger: 0.01,
    onComplete: (e) => {
      isAnimating = false;
    }
  });

  lastGrid = grid2;
}

// create a quadtree grid with random points/object centered around the mouse position
function generateGrid(focus) {
  const points = [...Array(128)].map(() => {
    return {
      x: randomBias(0, width, focus.x, 1),
      y: randomBias(0, height, focus.y, 1),
      width: 1,
      height: 1
    };
  });

  return createQtGrid({ width, height, points, maxQtLevels: 4 });
}

// on mouse move, create a new quadtree grid centered around the pointer position and update
function onMouseMove(e) {
  if (isAnimating) return;

  const { clientX, clientY } = e;

  mousePos.x = map(clientX, 0, window.innerWidth, 0, width);
  mousePos.y = map(clientY, 0, window.innerHeight, 0, height);

  updateItems();

  isAnimating = true;
}

window.addEventListener("pointermove", debounce(onMouseMove, 250));

window.addEventListener("pointermove", (e) => {
  gsap.to(".tracker", {
    x: e.clientX,
    y: e.clientY,
    opacity: 1,
    duration: 0.25,
    ease: "sine.out",
    transformOrigin: "50%"
  });
});