import compiler from './__example__/compiler.js';

test('Test webpack-i18n', async () => {
    const stats = await compiler('src/index.js', 'en-US');
    const statsJson = stats.toJson();
    // expect(statsJson.modules.length).toBe(4)
    statsJson.modules.forEach(m => {
        expect(m.source).toMatchSnapshot();
    })

});