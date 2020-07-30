import compiler from "./__example__/compiler.js";

test.only("Test webpack-i18n", async () => {
  const stats = await compiler();
  const statsJson = stats.toJson();
  ['index.js', 'level1.js', 'level2.js', 'level4.js'].forEach(fileName => {
    const module = statsJson.modules.filter(x => x.id.indexOf(fileName) >= 0)[0]
    expect(module && module.source).toMatchSnapshot()
  })
});

test("Test webpack-i18n with optional chaining", async () => {
  const stats = await compiler({ entry: "./src/optionalChainingIndex.js" });
  const statsJson = stats.toJson();
  statsJson.modules.forEach(m => {
    expect(m.source).toMatchSnapshot();
  });
});
