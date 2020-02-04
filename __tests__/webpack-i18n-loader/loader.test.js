import compiler from "./__example__/compiler.js";

test("Test webpack-i18n", async () => {
  const stats = await compiler();
  const statsJson = stats.toJson();
  statsJson.modules.forEach(m => {
    expect(m.source).toMatchSnapshot();
  });
});

test("Test webpack-i18n with optional chaining", async () => {
  const stats = await compiler({ entry: "./src/optionalChainingIndex.js" });
  const statsJson = stats.toJson();
  statsJson.modules.forEach(m => {
    expect(m.source).toMatchSnapshot();
  });
});
