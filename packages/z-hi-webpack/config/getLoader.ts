import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export const getLoader = (isEnv: boolean) => {
  const cssLoaderUse = [
    isEnv ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader',
  ];
  const svgOrImgLoaders = [
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'assets/images/[name].[ext]',
          },
        },
      ],
    },
  ];

  const ttfLoaders = [
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'assets/fonts/[name].[ext]',
          },
        },
      ],
    },
  ];
  const cssLoaders = [
    {
      test: /\.css$/,
      use: [...cssLoaderUse],
    },
  ];
  const lessLoaders = [
    {
      test: /\.less$/i,
      use: [...cssLoaderUse, 'less-loader'],
    },
  ];
  const tsFileLoaders = [
    {
      test: /\.(ts|tsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        'thread-loader',
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      ],
    },
  ];
  return {
    svgOrImgLoaders,
    ttfLoaders,
    cssLoaders,
    lessLoaders,
    tsFileLoaders,
  };
};
