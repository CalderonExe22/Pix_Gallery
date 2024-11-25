from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'photography',PhotographyAPIView,'photography')
router.register(r'category',CategoryAPIView,'category')
router.register(r'category-photography',CategoryPhotographyAPIView,'category-photography')
router.register(r'collections',CollectionAPIView,'collections')
urlpatterns = [
    path('', include(router.urls)),
    path('explore/', ExploreView.as_view(), name='explore'),
    path('explore/most_liked/', ExploreMostLikedPhotosView.as_view(), name='explore-most-liked'),
    path('explore/most_viewed/', ExploreMostViewedPhotosView.as_view(), name='explore-most-viewed'),
    path('explore/collections/most-viewed/', MostViewedCollectionsView.as_view(), name='most-viewed-collections'),
    path('explore/collections/most-liked/', MostLikedCollectionsView.as_view(), name='most-liked-collections'),
]
