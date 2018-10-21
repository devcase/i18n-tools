import compiler from './__example__/compiler.js';

test('Test webpack-i18n', async () => {
    const stats = await compiler('src/index.js', 'en-US');
    const statsJson = stats.toJson();
    // expect(statsJson.modules.length).toBe(4)
    expect(statsJson.modules[0].source).toMatchSnapshot();
    expect(statsJson.modules[1].source).toMatchSnapshot();
    expect(statsJson.modules[2].source).toMatchSnapshot();
    expect(statsJson.modules[3].source).toMatchSnapshot();

});