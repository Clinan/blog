module.exports = [
  // '/modules/literature/',
  {
    title: '现代诗词',
    collapsable: true,
    sidebarDepth: 1,
    children: [
      {
        title: '花花的诗',
        collapsable: true,
        sidebarDepth: 1,
        children: [
          '/modules/literature/poem',
        ]
      },
      {
        title: '木莺',
        collapsable: true,
        sidebarDepth: 1,
        children: [
          '/modules/literature/muying',
        ]
      },
    ]
  },
  {
    title: '蠢学',
    collapsable: true,
    sidebarDepth: 0,
    children: [
      '/modules/literature/chun-define',
    ]
  },
  {
    title: '隐蔽的角落',
    collapsable: true,
    children: [
      '/modules/hidden/',
    ]
  },
]