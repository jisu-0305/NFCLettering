import { AnimatePresence } from 'framer-motion';
import { Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import ScrollToTop from './components/common/ScrollToTop';
import DearHomePage from './pages/dear/Homepage';
import DearLandingPage from './pages/dear/LandingPage';
import DearLetterDetailPage from './pages/dear/LetterDetailPage';
import DearLetterPage from './pages/dear/LetterPage';
import DearMailBoxPage from './pages/dear/MailBoxPage';
import DearNoTagPage from './pages/dear/NoTagPage';
import OpenAppPage from './pages/dear/OpenAppPage';
import DearPostDetailPage from './pages/dear/PostcardDetailPage';
import DearPostcardPage from './pages/dear/PostcardPage';
import ErrorPage from './pages/ErrorPage';
import CheckoutPage from './pages/sender/CheckoutPage';
import CompleteLetterPage from './pages/sender/CompleteLetterPage';
import CompleteOrderPage from './pages/sender/CompleteOrderPage';
import CompletePage from './pages/sender/CompletePage';
import CompletePostcardPage from './pages/sender/CompletePostcardPage';
import CustomizePage from './pages/sender/CustomizePage';
import DeliveryTypePage from './pages/sender/DeliveryTypePage';
import DescribeKeyringPage from './pages/sender/DescribeKeyringPage';
import FontSettingPage from './pages/sender/FontSettingPage';
import HomePage from './pages/sender/Homepage';
import KeyringSettingPage from './pages/sender/KeyringSettingPage';
import LetterDetailPage from './pages/sender/LetterDetailPage';
import LetterPreviewPage from './pages/sender/LetterPreviewPage';
import LetterWritingPage from './pages/sender/LetterWritingPage';
import LoginPage from './pages/sender/LoginPage';
import MailBoxPage from './pages/sender/MailBoxPage';
import MyPage from './pages/sender/MyPage';
import OnBoadingPage from './pages/sender/OnBoadingPage';
import PostcardDetailPage from './pages/sender/PostcardDetailPage';
import PostcardPreviewPage from './pages/sender/PostcardPreviewPage';
import PostcardWritingPage from './pages/sender/PostcardWritingPage';
import SelectDearPage from './pages/sender/SelectDearPage';
import SelectThemePage from './pages/sender/SelectThemePage';
import SignUpPage from './pages/sender/SignUpPage';

const Router = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <RecoilRoot>
        <Suspense>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* sender */}
              <Route path="/" element={<OnBoadingPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />

              <Route path="/purchase" element={<DescribeKeyringPage />} />
              <Route path="/purchase/complete" element={<CompleteOrderPage />} />
              <Route path="/mailbox" element={<MailBoxPage />} />
              <Route path="/purchase/checkout" element={<CheckoutPage />} />
              <Route path="/purchase/customize" element={<CustomizePage />} />

              <Route path="/theme" element={<SelectThemePage />} />

              <Route path="/postcard/writing" element={<PostcardWritingPage />} />
              <Route path="/postcard/preview" element={<PostcardPreviewPage />} />
              <Route path="/postcard/detail/:messageId" element={<PostcardDetailPage />} />
              <Route path="/letter/writing" element={<LetterWritingPage />} />
              <Route path="/letter/preview" element={<LetterPreviewPage />} />
              <Route path="/letter/detail/:messageId" element={<LetterDetailPage />} />

              <Route path="/selectdear" element={<SelectDearPage />} />
              <Route path="/deliverytype" element={<DeliveryTypePage />} />

              <Route path="/complete" element={<CompletePage />} />
              <Route path="/complete/postcard" element={<CompletePostcardPage />} />
              <Route path="/complete/letter" element={<CompleteLetterPage />} />

              <Route path="/mypage" element={<MyPage />} />
              <Route path="/mypage/font" element={<FontSettingPage />} />
              <Route path="/mypage/keyring" element={<KeyringSettingPage />} />
              <Route path="/keyring" element={<DescribeKeyringPage />} />

              {/* dear */}
              <Route path="/dear" element={<DearLandingPage />} />
              <Route path="/dear/home" element={<DearHomePage />} />
              <Route path="/dear/notag" element={<DearNoTagPage />} />
              <Route path="/dear/postcard/:messageId" element={<DearPostcardPage />} />
              <Route path="/dear/postcard/detail/:messageId" element={<DearPostDetailPage />} />
              <Route path="/dear/letter/:messageId" element={<DearLetterPage />} />
              <Route path="/dear/letter/detail/:messageId" element={<DearLetterDetailPage />} />
              <Route path="/dear/mailbox" element={<DearMailBoxPage />} />
              <Route path="/openapp" element={<OpenAppPage />} />

              {/* common */}
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </RecoilRoot>
    </>
  );
};

export default Router;
