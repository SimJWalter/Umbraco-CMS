//used for the media picker dialog
angular.module("umbraco").controller("Umbraco.Editors.Media.MoveController",
    function ($scope, userService, eventsService, mediaResource, appState, treeService, navigationService) {

	    $scope.dialogTreeApi = {};
	    var node = $scope.currentNode;

        $scope.treeModel = {
            hideHeader: false
        }
        userService.getCurrentUser().then(function (userData) {
            $scope.treeModel.hideHeader = userData.startMediaIds.length > 0 && userData.startMediaIds.indexOf(-1) == -1;
        });

        function treeLoadedHandler(args) {
            if (node && node.path) {
                $scope.dialogTreeApi.syncTree({ path: node.path, activate: false });
            }
        }

	    function nodeSelectHandler(args) {

			if(args && args.event) {
				args.event.preventDefault();
				args.event.stopPropagation();
			}

	        eventsService.emit("editors.media.moveController.select", args);

	        if ($scope.target) {
	            //un-select if there's a current one selected
	            $scope.target.selected = false;
	        }

	        $scope.target = args.node;
	        $scope.target.selected = true;
	    }

		function nodeExpandedHandler(args) {
			// open mini list view for list views
        	if (args.node.metaData.isContainer) {
				openMiniListView(args.node);
			}
	    }

        $scope.onTreeInit = function () {
            $scope.dialogTreeApi.callbacks.treeLoaded(treeLoadedHandler);
            $scope.dialogTreeApi.callbacks.treeNodeSelect(nodeSelectHandler);
            $scope.dialogTreeApi.callbacks.treeNodeExpanded(nodeExpandedHandler);
        }	  
        
        $scope.close = function() {
            navigationService.hideDialog();
        };

	    $scope.move = function () {
	        mediaResource.move({ parentId: $scope.target.id, id: node.id })
                .then(function (path) {
                    $scope.error = false;
                    $scope.success = true;

                    //first we need to remove the node that launched the dialog
                    treeService.removeNode($scope.currentNode);

                    //get the currently edited node (if any)
                    var activeNode = appState.getTreeState("selectedNode");

                    //we need to do a double sync here: first sync to the moved content - but don't activate the node,
                    //then sync to the currenlty edited content (note: this might not be the content that was moved!!)

                    navigationService.syncTree({ tree: "media", path: path, forceReload: true, activate: false }).then(function (args) {
                        if (activeNode) {
                            var activeNodePath = treeService.getPath(activeNode).join();
                            //sync to this node now - depending on what was copied this might already be synced but might not be
                            navigationService.syncTree({ tree: "media", path: activeNodePath, forceReload: false, activate: true });
                        }
                    });

                }, function (err) {
                    $scope.success = false;
                    $scope.error = err;
                });
	    };
        
		// Mini list view
		$scope.selectListViewNode = function (node) {
			node.selected = node.selected === true ? false : true;
			nodeSelectHandler({}, { node: node });
		};

		$scope.closeMiniListView = function () {
			$scope.miniListView = undefined;
		};

		function openMiniListView(node) {
			$scope.miniListView = node;
		}

	});
