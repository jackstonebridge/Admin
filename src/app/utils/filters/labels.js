angular.module('proton.utils')
    .filter('labels', (userModel, $rootScope) => {

        let cache = [];
        const updateCache = () => {
            cache = _.sortBy(userModel.get().Labels, 'Order');
        };

        $rootScope.$on('deleteLabel', () => updateCache());
        $rootScope.$on('createLabel', () => updateCache());
        $rootScope.$on('updateLabel', () => updateCache());
        $rootScope.$on('updateLabels', () => updateCache());

        return (labels = []) => {
            if (userModel.get()) {
                (!cache.length) && updateCache();
                return _.filter(cache, ({ ID }) => labels.some((id) => id === ID));
            }

            return [];
        };
    });
