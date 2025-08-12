export default {
  logo: (
    <>
      <img src="/prisma-logo.svg" style={{ height: 32, marginRight: 10, verticalAlign: 'middle', display: 'inline-block' }} alt="Prisma logo" />
      <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: -1, color: '#1a1a1a', verticalAlign: 'middle' }}>Prisma Design System</span>
    </>
  ),
  project: {
    link: 'https://prisma.io/'
  },
  docsRepositoryBase: 'https://github.com/prisma/prisma-v5/tree/main/apps/frontend/pages',
  primaryColor: '#bf3e48',
  footer: {
    text: '© ' + new Date().getFullYear() + ' Prisma v5 Design System.'
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Prisma Design System',
      description: 'Documentación premium del sistema de diseño Prisma v5.'
    }
  }
}
