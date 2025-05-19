'''import numba
import os

# Disable numba's caching system
os.environ['NUMBA_CACHE_DIR'] = '/dev/null'
numba.config.DISABLE_JIT = True
numba.config.CACHE_DIR = '/dev/null'

import pandas as pd
from sklearn.preprocessing import StandardScaler
#from hdbscan import HDBSCAN
from sklearn.cluster import HDBSCAN
from umap import UMAP
from wordcloud import WordCloud
import numpy as np

def extract_action_urls(data):
    """
    Extract and process URLs from the action details in JSON data.

    Args:
        data (list): List of actions with details in JSON format.

    Returns:
        dict: Aggregated time spent on each processed URL.
    """
    urls = []
    for action in data:
        url = action.get('url')
        if url:
            # Simplify URL by trimming to relevant parts
            n = url.count('/')
            if n >= 4:
                inds = [i for i, ch in enumerate(url) if ch == '/']
                last = inds[3]
                url = url[:last]
            if '?' in url:
                last = url.index('?')
                url = url[:last]
            url = url.replace('https://', '')
            url = url.replace('http://', '')
            url = url.replace('www.', '')
            
            time = action.get('timeSpent')
            urls.append({'url': url, 'time': time})

    # Aggregate the time spent on each URL
    urls_df = pd.DataFrame(urls)
    if not urls_df.empty:
        urls_df = urls_df.groupby('url').agg(sum)
        return urls_df['time'].to_dict()
    return {}

def normalize_data(json_data):
    """
    Normalize the JSON data into a DataFrame.

    Args:
        json_data (list of dict): List of records with action details.

    Returns:
        pd.DataFrame: Normalized DataFrame with URLs as columns.
    """
    df = pd.DataFrame(json_data)
    df['url'] = df['actionDetails'].apply(extract_action_urls)
    df = df[['url']]
    df_normalized = pd.json_normalize(df['url']).fillna(0)
    return df_normalized

def perform_clustering(df):
    """
    Perform data scaling, dimensionality reduction, and clustering.

    Args:
        df (pd.DataFrame): DataFrame with URL time data.

    Returns:
        pd.DataFrame: DataFrame with clustering results and processed data.
        np.array: 2D array after dimensionality reduction with UMAP.
        HDBSCAN: Fitted HDBSCAN model.
    """
    # Scaling the data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df)

    # Dimensionality reduction using UMAP
    umap_model = UMAP(metric='euclidean')
    X_umap = umap_model.fit_transform(X_scaled)

    # Clustering with HDBSCAN
    model = HDBSCAN(cluster_selection_epsilon=1)
    model.fit(X_umap)

    # Assign cluster labels to DataFrame
    df['cluster'] = model.labels_
    return df, X_umap, model

def generate_wordcloud_data(df, model):
    """
    Generate word cloud data for each cluster.

    Args:
        df (pd.DataFrame): DataFrame with clustered data.
        model (HDBSCAN): Fitted HDBSCAN model.

    Returns:
        dict: Word frequencies for each cluster.
    """
    clusters = set(model.labels_)
    wordcloud_data = {}

    # Iterate through each cluster to generate word cloud data
    for c in clusters:
        if c == -1:
            wordcloud_data[c] = {'terms': {}, 'label': 'Noise'}
            continue

        df_c = df[df['cluster'] == c].drop(columns=['cluster'])
        s = df_c.sum()

        # Capture top features for each cluster
        if s.max() > 0:
            top_features = s.nlargest(10).to_dict()  # Top 10 terms with their frequencies
            wordcloud_data[c] = {
                'terms': top_features,
                'label': ', '.join(list(top_features.keys())[:3])  # A short label based on top terms
            }
    
    return wordcloud_data

def prepare_clustering_data(X_umap, model):
    """
    Prepare clustering data for visualization.

    Args:
        X_umap (np.array): 2D array after dimensionality reduction.
        model (HDBSCAN): Fitted HDBSCAN model.

    Returns:
        list: JSON data ready for clustering visualization.
    """
    # Prepare DataFrame for visualization
    vis_df = pd.DataFrame(X_umap, columns=['x', 'y'])
    vis_df['cluster'] = model.labels_

    # Convert to JSON format
    result = vis_df.to_dict(orient='records')
    return result

def process_data(json_data):
    """
    Main function to process the JSON data and generate clustering and word cloud data.

    Args:
        json_data (list of dict): List of JSON records with user actions.

    Returns:
        dict: JSON object with clustering data and word cloud data.
    """
    # Step 1: Normalize the data
    df = normalize_data(json_data)

    # Step 2: Perform clustering
    df, X_umap, model = perform_clustering(df)

    # Step 3: Generate word cloud data for each cluster
    wordcloud_data = generate_wordcloud_data(df, model)

    # Step 4: Prepare clustering data for visualization
    clustering_data = prepare_clustering_data(X_umap, model)

    # Return the JSON structure with clustering and word cloud data
    return {
        "clustering_data": clustering_data,
        "wordcloud_data": wordcloud_data
    }

# Example usage
# Assuming `json_data` is the input JSON data (list of dict)
# json_data = [...]  # Load your JSON data here
# result = process_data(json_data)
# print(result)
'''