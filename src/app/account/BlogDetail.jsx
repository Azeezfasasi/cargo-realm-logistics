import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import Header from '../../assets/component/HomeComponents.jsx/Header';
import Footer from '../../assets/component/HomeComponents.jsx/Footer';
import BlogDetailMain from '../../assets/component/DashboardComponents.jsx/BlogDetailMain';

function BlogDetail() {
  return (
    <>
    <Helmet>
        <title>Blog Details - Cargo Realm and Logistics</title>
    </Helmet>
    <Header />
    <BlogDetailMain />
    <Footer />
    </>
  )
}

export default BlogDetail;