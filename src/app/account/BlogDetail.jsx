import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import Header from '../../assets/component/HomeComponents.jsx/Header';
import Footer from '../../assets/component/HomeComponents.jsx/Footer';
import BlogDetailMain from '../../assets/component/DashboardComponents.jsx/BlogDetailMain';
import HeaderSection from '@/assets/component/HomeComponents.jsx/HeaderSection';
import FooterSection from '@/assets/component/HomeComponents.jsx/FooterSection';

function BlogDetail() {
  return (
    <>
    <Helmet>
        <title>Blog Details - Cargo Realm and Logistics</title>
    </Helmet>
    <HeaderSection />
    <BlogDetailMain />
    <FooterSection />
    </>
  )
}

export default BlogDetail;