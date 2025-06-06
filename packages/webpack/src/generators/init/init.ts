import {
  addDependenciesToPackageJson,
  createProjectGraphAsync,
  formatFiles,
  GeneratorCallback,
  readNxJson,
  Tree,
} from '@nx/devkit';
import { addPlugin } from '@nx/devkit/src/utils/add-plugin';
import { createNodesV2 } from '../../plugins/plugin';
import { nxVersion, webpackCliVersion } from '../../utils/versions';
import { Schema } from './schema';

export function webpackInitGenerator(tree: Tree, schema: Schema) {
  return webpackInitGeneratorInternal(tree, { addPlugin: false, ...schema });
}

export async function webpackInitGeneratorInternal(tree: Tree, schema: Schema) {
  const nxJson = readNxJson(tree);
  const addPluginDefault =
    process.env.NX_ADD_PLUGINS !== 'false' &&
    nxJson.useInferencePlugins !== false;
  schema.addPlugin ??= addPluginDefault;

  if (schema.addPlugin) {
    await addPlugin(
      tree,
      await createProjectGraphAsync(),
      '@nx/webpack/plugin',
      createNodesV2,
      {
        buildTargetName: [
          'build',
          'webpack:build',
          'build:webpack',
          'webpack-build',
          'build-webpack',
        ],
        serveTargetName: [
          'serve',
          'webpack:serve',
          'serve:webpack',
          'webpack-serve',
          'serve-webpack',
        ],
        previewTargetName: [
          'preview',
          'webpack:preview',
          'preview:webpack',
          'webpack-preview',
          'preview-webpack',
        ],
        buildDepsTargetName: [
          'build-deps',
          'webpack:build-deps',
          'webpack-build-deps',
        ],
        watchDepsTargetName: [
          'watch-deps',
          'webpack:watch-deps',
          'webpack-watch-deps',
        ],
      },
      schema.updatePackageScripts
    );
  }

  let installTask: GeneratorCallback = () => {};
  if (!schema.skipPackageJson) {
    const devDependencies = {
      '@nx/webpack': nxVersion,
      '@nx/web': nxVersion,
    };

    if (schema.addPlugin) {
      devDependencies['webpack-cli'] = webpackCliVersion;
    }

    installTask = addDependenciesToPackageJson(
      tree,
      {},
      devDependencies,
      undefined,
      schema.keepExistingVersions
    );
  }

  if (!schema.skipFormat) {
    await formatFiles(tree);
  }

  return installTask;
}

export default webpackInitGenerator;
