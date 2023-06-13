const fs = require("fs");
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sanitizeName(n) {
  return n.replace(/\//g, "-").replace(/:/g, "-");
}

function toSnakeCase(str) {
  return str
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/([a-z])([A-Z])/g, "$1_$2") // Convert camelCase to snake_case
    .toLowerCase(); // Convert to lowercase
}

// Function to create directories recursively
const createDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Function to create the links.md file with the list of links
const createResourceFile = (directoryPath, links, title) => {
  const linksContent = links
    .map((link) => `[${link.link_title}](${link.link_url})`)
    .join("\n");
  fs.writeFileSync(directoryPath, title + "\n" + linksContent);
  console.log(`Created links.md file: ${directoryPath}`);
};

// JSON data with the desired structure

const filePath = process.argv[2];

// Read the JSON file
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    process.exit(1);
  }

  // Parse the JSON data
  try {
    let jsonData = JSON.parse(data);
    let sectionIndex = 1;
    let lectureIndex = 1;
    for (const section of jsonData.sections) {
      let sectionKebab = `${sectionIndex
        .toString()
        .padStart(2, "0")}_${capitalize(
        toSnakeCase(sanitizeName(section.section_title))
      )}`;
      createDirectory(`./courses/${sectionKebab}`);
      for (const lecture of section.lectures) {
        let lectureKebab = sanitizeName(lecture.lecture_title);
        createResourceFile(
          `./courses/${sectionKebab}/${lectureIndex
            .toString()
            .padStart(3, "0")}_${lectureKebab}.md`,
          lecture.links,
          "# " + lecture.lecture_title + " \n\n"
        );
        lectureIndex++;
      }
      sectionIndex++;
    }
  } catch (err) {
    console.error(`Error parsing JSON: ${err}`);
    process.exit(1);
  }
});
